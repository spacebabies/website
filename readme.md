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
hugo new changelog/title-here --kind changelog
```

Both the changelog `kind` and the directory are needed, because our archetype is directory-based.

# Deploy

Hosted on Netlify.

```
git push origin master
```
