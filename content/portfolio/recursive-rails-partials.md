+++
title = 'Recursive Rails partials'
date = "2018-08-24T14:56:22+05:30"
+++
Love it when I make the world slightly better by improving an Open Source product I use.
<!--more-->

I am a big fan of [Ancestry](https://github.com/stefankroes/ancestry), software that helps
define relationships between things. Often used to organize categories.

It provides a means to spit out all the items it contains, neatly arranged. But!
The list can be arbitrarily deep. Seven, 42, a hundred.... this freedom is somewhat
of a nuisance when you're trying to automate things.

To solve it, you need code that runs itself any amount of time.

_Recursion._ Tum dum duuummm!!

<div style="width:100%;height:0;padding-bottom:95%;position:relative;"><iframe src="https://giphy.com/embed/ArobrE6qU5QDC" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/wtf-time-ArobrE6qU5QDC">via GIPHY</a></p>

#### Rails partials

The [Ancestry wiki](https://github.com/stefankroes/ancestry/wiki) contains code examples that build an HTML list. I don't think
it's great code, because it doesn't use the power of Rails very much. When rendering
things, of course you should use a *partial*.

But how to recursively render a partial?

Well, a helper for starters:

``` ruby
module AncestryHelper
  # Recursively render a partial from an Ancestry arranged subtree.
  def arranged_tree_table_rows(tree)
    tree.each do |node, children|
      concat render partial: 'tree_node', object: node
      arranged_tree_table_rows(children) if children.present?
    end
  end
end
```

The subtree goes in the controller:

``` ruby
class SomeController < ApplicationController
  def index
    @subtree = TreeNode.find_by_name('Crunchy').subtree.arrange
  end
end
```

And the view takes all credit:

``` erb
<% arranged_tree_table_rows(@subtree) %>
```

Voilà. Add caching and enjoy!
