#!/usr/bin/env bash
# Depends-on: icoutils inkscape

for size in 36 48 50 57 62 64 72 80 96 114 128 144 173
do
    inkscape -z --export-background=FFFFFF --export-png=icon-${size}px.png --export-width=${size} --export-height=${size} icon.svg
done

# Android
cp icon-36px.png android/icon-36-ldpi.png
cp icon-48px.png android/icon-48-mdpi.png
cp icon-72px.png android/icon-72-hdpi.png
cp icon-96px.png android/icon-96-xhdpi.png

# Bada
cp icon-128px.png bada/icon-128.png

# Bada Wac
cp icon-48px.png bada-wac/icon-48-type5.png
cp icon-50px.png bada-wac/icon-50-type3.png
cp icon-80px.png bada-wac/icon-80-type4.png

# BlackBerry
cp icon-80px.png blackberry/icon-80.png

# iOS
cp icon-57px.png  ios/icon-57.png
cp icon-72px.png  ios/icon-72.png
cp icon-114px.png ios/icon-57-2x.png
cp icon-144px.png ios/icon-72-2x.png

# Tizen
cp icon-128px.png tizen/icon-128.png

# WebOS
cp icon-64px.png  webos/icon-64.png

# Windows Phone
cp icon-48px.png  windows-phone/icon-48.png
cp icon-62px.png  windows-phone/icon-62-tile.png
cp icon-173px.png windows-phone/icon-173-tile.png

# Removes useless files
rm -f icon-*px.png
