require 'rubygems'
require 'bundler'
require 'pathname'
require 'logger'
require 'fileutils'
require 'yaml'
require 'active_support/core_ext'

Bundler.require

ROOT = Pathname(File.dirname(__FILE__))
LOGGER = Logger.new(STDOUT)
OUTPUT_DIR = ROOT.join("www")
SOURCE_DIR = ROOT.join("app", "assets")

desc "Compile assets and html"
task :compile_assets do
  config = {
    "files" => ["application.js", "application.css"],
    "js_compressor" => :uglify,
    "css_compressor" => :scss
  }

  config_file = ROOT.join(".sprockets.yml")
  if config_file.exist?
    config.update YAML.load_file(config_file)
  end

  environment = Sprockets::Environment.new(ROOT)
  environment.logger = LOGGER
  environment.js_compressor  = config['js_compressor']
  environment.css_compressor = config['css_compressor']
  for scope in %w(app lib vendor)
    for type in %w(stylesheets images javascripts fonts)
      dir = ROOT.join(scope, "assets", type)
      environment.append_path(dir)
      config["files"] += Dir.glob(dir.join("**", "*.{gif,png,jpg,svg,eot,woff,ttf}"))
    end
  end
  
  environment.context_class.class_eval do
    def asset_path(path, options = {})
      path
    end
  end


  manifest = Sprockets::Manifest.new(environment, OUTPUT_DIR)

  paths = environment.each_logical_path(config["files"]).to_a +
    config["files"].flatten.select { |fn| Pathname.new(fn).absolute? if fn.is_a?(String)}
  
  paths.each do |path|
    if asset = environment.find_asset(path)
      manifest.files[asset.digest_path] = {
        'logical_path' => asset.logical_path,
        'mtime' => asset.mtime.iso8601,
        'size' => asset.bytesize,
        # 'digest' => asset.digest
      }
      # assets[asset.logical_path] = asset.digest_path
      
      # target = File.join(dir, asset.digest_path)
      target = File.join(manifest.dir, asset.logical_path)
      
      # if File.exist?(target)
      #   logger.debug "Skipping #{target}, already exists"
      # else
      environment.logger.info "Writing #{target}"
      asset.write_to target
      # asset.write_to "#{target}.gz" if asset.is_a?(BundledAsset)
      # end
      
    end
  end

  # manifest.compile(config["files"])
end

desc "Compile views as HTML (only for now)"
task :compile_views do
  # -r #{ROOT}/app/helpers/helpers.rb
  # `haml #{ROOT}/app/views/index.html.haml #{ROOT}/www/index.html`
  unless file = Dir.glob(ROOT.join("app", "views", "index.html.*")).delete_if{|f| f =~ /~$/}.first
    puts "Need views"
    exit 1
  end
  helpers_dir = ROOT.join("app", "helpers")
  Dir.chdir helpers_dir do
    for helper in Dir["*.rb"]
      require helpers_dir.join(helper)
      Object.send(:include, helper[0..-4].camelize.constantize)
    end
  end
  template = Tilt.new(file)
  File.write(ROOT.join('www', 'index.html'), template.render)
end

desc "Compile all"
task :compile => [:compile_assets, :compile_views]


desc "Compile all and build android app"
task :build => :compile do
  `phonegap build android`
end

desc "Compile all, build and install android app"
task :install => :build do
  `adb install -r platforms/android/ant-build/Rei-debug.apk`
end

task default: :install
