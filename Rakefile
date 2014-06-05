$:.push File.expand_path("../lib", __FILE__)
require 'rubygems'
require 'bundler'
require 'rei'

ENV["RAILS_ENV"] = "production"

COPIED_RESOURCES = {
  # Android
  "platforms/android/res/drawable/icon.png"       => "config/resources/icon/android/xhdpi.png",
  "platforms/android/res/drawable-xhdpi/icon.png" => "config/resources/icon/android/xhdpi.png",
  "platforms/android/res/drawable-hdpi/icon.png"  => "config/resources/icon/android/hdpi.png",
  "platforms/android/res/drawable-mdpi/icon.png"  => "config/resources/icon/android/mdpi.png",
  "platforms/android/res/drawable-ldpi/icon.png"  => "config/resources/icon/android/ldpi.png",
  "platforms/android/res/drawable/screen.png"       => "config/resources/screen/android/xhdpi-portrait.png",
  "platforms/android/res/drawable-xhdpi/screen.png" => "config/resources/screen/android/xhdpi-portrait.png",
  "platforms/android/res/drawable-hdpi/screen.png"  => "config/resources/screen/android/hdpi-portrait.png",
  "platforms/android/res/drawable-mdpi/screen.png"  => "config/resources/screen/android/mdpi-portrait.png",
  "platforms/android/res/drawable-ldpi/screen.png"  => "config/resources/screen/android/ldpi-portrait.png"
  # iOS ?
}

namespace :precompile do
  
  desc "Precompile resources (icons and screens)"
  task :resources do
    Dir.chdir(Rei.root.join("config", "resources", "icon")) do
      `./build`
    end
    Dir.chdir(Rei.root.join("config", "resources", "screen")) do
      `./build`
    end
  end

  desc "Precompile assets (JS, CSS and media files)"
  task :assets do
    Rei::AssetsCompiler.write!
  end
  
  desc "Precompile views as HTML"
  task :views do
    Rei::ViewsCompiler.write!
  end

  desc "Precompile assets and views"
  task :app => [:assets, :views] do
    for dest, source in COPIED_RESOURCES
      FileUtils.mkdir_p Rei.root.join(dest).dirname
      FileUtils.cp Rei.root.join(source), Rei.root.join(dest)
    end
  end

end

desc "Precompile all"
task :precompile => [:"precompile:resources", :"precompile:app"]


desc "Precompile all and build android app"
task :build => :"precompile:app" do
  `phonegap build android`
end

desc "Precompile all and build android app"
task :deploy do
  `adb install -r platforms/android/ant-build/Rei-debug.apk`
end

desc "Precompile all, build and install android app"
task :install => [:build, :deploy]

task default: :install
