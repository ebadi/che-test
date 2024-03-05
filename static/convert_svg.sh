
# uncoment for re generating these images
convert -background none   logo.svg -resize 57x57\!  logo57x57.png
convert -background none   logo.svg -resize 100x100\!  logo100x100.png
convert -background none   logo.svg -resize 200x200\!  logo200x200.png
convert -background none   logo.svg -resize 180x180\!  logo180x180.png
convert -background none   logo.svg -resize 350x350\!  logo350x350.png
convert -background none   logo.svg -resize 512x512\!  logo512x512.png
convert -background none   logo.svg -resize 16x16\!    logo16x16.png
convert -background none   logo.svg -resize 32x32\!    logo32x32.png
convert -background none   logo.svg -resize 144x144\!  logo144x144.png

convert -background none   logo.svg -resize 36x36\!    logo36x36.png
convert -background none   logo.svg -resize 48x48\!    logo48x48.png
convert -background none   logo.svg -resize 72x72\!    logo72x72.png
convert -background none   logo.svg -resize 96x96\!    logo96x96.png
convert -background none   logo.svg -resize 192x192\!  logo192x192.png
convert -background none   logo.svg -resize 256x256\!  logo256x256.png
convert -background none   logo.svg -resize 384x384\!  logo384x384.png
convert -background none   logo.svg -resize 650x650\!  logo650x650.png
convert -background none   logo.svg -resize 70x70\!    logo70x70.png
convert -background none   logo.svg -resize 150x150\!  logo150x150.png
convert -background none   logo.svg -resize 310x310\!  logo310x310.png

convert -background none   logo-with-circle.svg -resize 57x57\!  logo-with-circle57x57.png
convert -background none   logo-with-circle.svg -resize 100x100\!  logo-with-circle100x100.png
convert -background none   logo-with-circle.svg -resize 200x200\!  logo-with-circle200x200.png
convert -background none   logo-with-circle.svg -resize 180x180\!  logo-with-circle180x180.png
convert -background none   logo-with-circle.svg -resize 350x350\!  logo-with-circle350x350.png
convert -background none   logo-with-circle.svg -resize 512x512\!  logo-with-circle512x512.png



convert -background none -density 256x256\! -background transparent logo.svg -define icon:auto-resize -colors 256 favicon.ico
rm ../favicon.ico
cp favicon.ico ../favicon.ico

# https://capacitorjs.com/docs/guides/splash-screens-and-icons
#resources/
#├── icon-only.png
#├── icon-foreground.png
#├── icon-background.png
#├── splash.png
#└── splash-dark.png
#   Icon files should be at least 1024px x 1024px.
#   Splash screen files should be at least 2732px x 2732px.
#   The format can be jpg or png.


convert -background none -density 288  logo-with-circle.svg -gravity center -resize 1024x1024\! icon-only.png
convert -background none -density 288  logo-with-circle.svg -gravity center -resize 1024x1024\! icon-foreground.png
convert -background none -density 288  logo-with-circle.svg -gravity center -resize 1024x1024\! icon-background.png
convert -background none -density 288  logo-with-circle.svg -gravity center -resize 500x500\!   splash.png
convert -background none -density 288  logo-with-circle.svg -gravity center -resize 500x500\!   splash-dark.png

png2icns favicon.icns icon-only.png

convert -background white -gravity center  logo-with-circle.svg -resize 200x200 -extent 600x250 header.png




#mkdir ../../resources
mv -t ../../resources   icon-*.png
mv -t ../../resources   splash*png


