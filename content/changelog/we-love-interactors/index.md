---
title: "We Love Interactors"
date: 2016-06-24T23:28:24+01:00
description: Everybody hates long and complicated controller actions (if you don’t; go home.) If you’ve ever had to unpick a 20+ lines of `def create` in a legacy app, you will understand why we at Space Babies are a big fan of [Interactors](https://github.com/collectiveidea/interactor)!
draft: false
index: true
series: # array. specify related “see also” pages by placing them in the same series.
tags: # array

audio: # array of absolute paths
images: # array of absolute paths
  - /changelog/we-love-interactors/image.jpg
videos: # array of absolute paths
---
{{% param description %}}

_By Melanie Keatley, Space Babies developer_

Let me show you how you can add this brilliance to your Rails application.

Let’s say our Rails App is an API that is used for zoo management. It’s an exciting day for our zoo; they have been gifted a manticore named Fred. Lucky! When an employee of the zoo adds the manticore to the application, information will be stored through the `Animals::Controller`.

When storing a new Animal instance, a lot of stuff needs to happen. We are not just storing the manticore’s attributes (name, birthday, colour), but attributes from related models are also dealt with: Images of Fred the Manticore, Locations where Fred previously lived and his regular zookeepers.

Our Create action in `Animals::Controller` starts by calling the Animals Interactor:

{{< highlight ruby >}}

result = Animals::Create.call user: current_user, animal_params: animal_params

{{< /highlight >}}

Images, locations and keepers are added to the animal_params through the API’s post request. When the controller sends the interactor our animal_params and current_user, these are stored in the context that is passed through the Animals interactor.

When we look in our animals folder within the interactors folder, we see several files: add_images.rb, create.rb, locations.rb, keepers.rb and set_up.rb.

{{< highlight ruby >}}
class Animals::Create  
  include Interactor::Organizer

  before do  
    context.images = context.animal_params.delete(:images)  
    context.locations = context.animal_params.delete(:locations)  
    context.keepers = context.animal_params.delete(:keepers)  
  end

 organize
   [  
    Animals::SetUp,  
    Animals::AddImages,  
    Animals::Places,  
    Animals::Keepers  
   ]

end
{{< /highlight >}}

The Controller first sends the context to the `Animals::Create` file. This is the organize part of our interactor. First: to have actual clean animal attributes when we create a new animal instance, we let our interactor strip out the images, locations and zookeepers and store those in separate context keys in a before block.

The organize list is where we let the interactor context now what the order is, that it should go through the interactor files. Looking at it, we see that it sends the animal params to the ‘SetUp’ interactor next.

{{< highlight ruby >}}
class Animals::SetUp  
  include Interactor

  def call  
    animal = Animal.new context.animal_params  
    animal.creator = context.user

    if animal.save  
      context.animal = animal  
      context.status = :created  
    else  
      context.status = :bad_request  
      context.fail! message: animal.errors.full_messages  
    end  
  end  
end
{{< /highlight >}}

In SetUp manticore Fred’s attributes are stored in a new Animal instance. If this is successful, the interactor will continue to the next action, which is `Animals::AddImages`. Because Fred is such a beautiful manticore, we can not capture is essence in one image as an attribute on the animal instance. We need several images, stored as Imageable through a polymorphic association.

If at any step the interactor hits broken code, and can’t continue, the interactor will roll back through the entire chain, undoing what it was trying to do. If there are no images of Fred uploaded at this time, Animals::AddImages will call return and the interactor goes on to Animals::Places.

{{< highlight ruby >}}
class Animals::AddImages  
  include Interactor

  def call  
    return unless context.images

    context.animal.images.clear  
    context.images.each do |i|  
      image = Image.new image: i  
      image.imageable = context.animal

      unless image.save  
        context.status = :bad_request  
        context.fail! message: image.errors.full_messages  
      end  
    end  
  end  
end
{{< /highlight >}}

In `Animals::Places`, a location (e.g. previous zoo), related to our manticore is stored (name, address, etc.).

Last stop is the Animals::Keepers. This is where we add the zookeepers who are responsible for Fred are stored.

When the context has passed successfully through the chain of interactors, it successfully returns to the Controller. What a squeaky clean controller!

{{< highlight ruby >}}
class V3::AnimalsController < V3::BaseController
  def create  
    result = Animals::Create.call user: current_user, animal_params: animal_params  
    if result.success?  
      render json: result.animal, status: result.status  
    else  
      render json: {error: {message: result.message}}, status:  
      result.status  
    end  
  end
end
{{< /highlight >}}

Now, one day, the Zoo’s chief curator decides that he really wants to be able to store an animals’ parents in the application. Seems logical enough. Never fear. This is going to be really easy, because we have our interaction in place.

All we need to do, after creating an association in the db, is add the parent animals to our animal_params, have Animals::Parents called upon by adding it to the organize section and add a new file in our interaction’s folder.

{{< highlight ruby >}}
organize [  
 Animals::SetUp,  
 Animals::Parents,  
 Animals::AddImages,  
 Animals::Places,  
 Animals::Keepers  
 ]
{{< /highlight >}}

Need to add more actions? Just keep tacking them on to the Animals::Interactor. As each action will have its own file, our controller remains skinny and the code stays legible.

For your Update action in the controller, most of the interactor files can be reused. In our update controller action we are sending the animal params, together with the animal’s id.

{{< highlight ruby >}}
def update  
  result = Animals::Update.call animal_params.merge(id: params[:id])

if result.success?  
    render json: result.animal  
  else  
    render json: {error: {message: result.message}}, status:  
    result.status  
  end  
end
{{< /highlight >}}

Then add a new organize file to the animals folder in the interactors folder.

{{< highlight ruby >}}
class Animals::Update  
  include Interactor::Organizer

organize [  
  Animals::FindAnimal,  
  Animals::Parents,  
  Animals::AddImages,  
  Animals::Locations,  
  Animals::Keepers**  
]

end
{{< /highlight >}}

And the FindAnimal file is expecting the animal params and animal’s id.

{{< highlight ruby >}}
class Animals::FindAnimal  
  include Interactor

  def call  
    if animal.update context.to_h.slice(:name, :birthday, :colour)  
      context.animal = animal  
    else  
      context.status = :bad_request  
      context.fail! message: animal.errors.full_messages  
    end  
  end

  private

  def animal  
    Animal.find context.id  
  end

end
{{< /highlight >}}

