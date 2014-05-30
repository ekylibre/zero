$:.push File.expand_path("../lib", __FILE__)
require 'rubygems'
require 'bundler'
require 'rei'

namespace :compile do
  desc "Compile assets (JS, CSS and media files)"
  task :assets do
    Rei::AssetsCompiler.write!
  end
  
  desc "Compile views as HTML"
  task :views do
    Rei::ViewsCompiler.write!
  end
end

desc "Compile all"
task :compile => [:"compile:assets", :"compile:views"]


desc "Compile all and build android app"
task :build => :compile do
  `phonegap build android`
end

desc "Compile all, build and install android app"
task :install => :build do
  `adb install -r platforms/android/ant-build/Rei-debug.apk`
end

task default: :install
