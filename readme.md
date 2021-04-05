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

# Optimize images

```
exiftool -r -all= -overwrite_original assets/images
find assets/images -type f -name *.jpg -exec mogrify -resize '1400>' {} \;
find assets/images -type f -name *.png -exec mogrify -resize '1400>' {} \;
find assets/images -type f -name *.jpg -exec jpegoptim --strip-all --all-progressive {} \;
find assets/images -type f -name *.png -exec optipng -clobber -strip all {} \;
```
