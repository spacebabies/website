+++
title = "Bitbucket Pipelines: now 200% more DRY"
images = ["img/portfolio/bitbucket-pipelines-header.png"]
showonlyimage = false
date = "2018-08-28T11:20:19+05:30"
+++
Today, I saw the *future*. And it was bright. And full of annoying youngsters who acted as if they were the alpha and omega of society, now get off my lawn!!
<!--more-->

I've been keeping an eye on Bitbucket Pipelines lately; it's a service that offers
to test and release software with all the heavywork offlifted to them. Plus, it
looks and works really nicely.

So, it being a queit _summer vacay_ and all, I took the plunge.

<img src="/img/portfolio/bitbucket-pipelines-flower.png" class="img-responsive" alt="Bitbucket Pipelines. It... grows in a pot?">

I won't write in detail about how the experience was. There is plenty of
documentation around and all of it is adequate. But one thing really annoyed me:
their configuration file examples contain tons of duplicate code. And duplication
is the devil! Exterminate!

So how do we improve it? YAML anchors is how, brother.

This example code comes straight from [branch workflows](https://confluence.atlassian.com/bitbucket/branch-workflows-856697482.html):

```yml
pipelines:
  default:
    - step:
        script:
          - echo "This script runs on all branches that don't have any specific pipeline assigned in 'branches'."
  branches:
    master:
      - step:
          script:
            - echo "This script runs only on commit to the master branch."
    feature/*:
      - step:
          image: openjdk:8 # This step uses its own image
          script:
            - echo "This script runs only on commit to branches with names that match the feature/* pattern."
```

It pains me to even think about looking at it. The horror! Let's get real and
look at an actual configuration file in use by Space Babies:

```yml
pipelines:
  default:
    - step: &run_tests
        name: Run the tests
        caches:
          - bundler
        script:
          - bundle install --path vendor/bundle
          - bundle exec rake db:setup
          - bundle exec rake
        services:
          - postgres
          - redis
  branches:
    master:
      - step:
          <<: *run_tests
      - step:
          name: Deploy to production
          deploy: production
          script:
            - http POST $REDEPLOYMENT_URL
    staging:
      - step:
          <<: *run_tests
      - step:
          name: Deploy to staging
          deploy: staging
          script:
            - http POST $REDEPLOYMENT_URL
```

As you can see, I've labelled the default step `&run_tests` and I inject it
into both branch-specific workflows. Works perfectly. _(The astute reader has
already tsk-tsked my duplicated branch-specific steps. I know! WIP)_
