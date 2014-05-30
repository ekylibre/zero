require 'yaml'
require 'sprockets'

module Rei
  module AssetsCompiler

    # Writes assets without digest nor manifest
    # It users a config file .sprockets.yml if necessary
    def self.write!
      config = {
        "files" => ["application.js", "application.css"],
        "js_compressor" => :uglify,
        "css_compressor" => :scss
      }

      config_file = Rei.root.join(".sprockets.yml")
      if config_file.exist?
        config.update YAML.load_file(config_file)
      end

      environment = Sprockets::Environment.new(Rei.root)
      environment.logger = Rei.logger
      environment.js_compressor  = config['js_compressor']
      environment.css_compressor = config['css_compressor']
      for scope in %w(app lib vendor)
        for type in %w(stylesheets images javascripts fonts)
          dir = Rei.root.join(scope, "assets", type)
          environment.append_path(dir)
          config["files"] += Dir.glob(dir.join("**", "*.{gif,png,jpg,svg,eot,woff,ttf}"))
        end
      end
      
      environment.context_class.class_eval do
        def asset_path(path, options = {})
          path
        end
      end


      manifest = Sprockets::Manifest.new(environment, Rei.output)

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

  end
end
