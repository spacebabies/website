# Install

```
sudo apt install hugo # optional, if you don't have the binary
yarn install
```

# Run

```
hugo server
```

# New content

```
hugo new --kind changelog changelog/title-here
```

## Refresh search index

This is part of the deploy process, but you can do it manually too.

```
yarn index # just generate the index in public
yarn index-and-send # generate and store in Algolia
```

# Deploy

Hosted on Netlify.

```
git push origin master
```
