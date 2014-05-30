require 'rei/helpers/tag_helper'

module Rei
  module Helpers
    module AssetTagHelper

      include TagHelper

      URI_REGEXP = %r{^[-a-z]+://|^(?:cid|data):|^//}i
      ASSET_EXTENSIONS = { javascript: '.js', stylesheet: '.css' }
      ASSET_PUBLIC_DIRECTORIES = { audio: '/audios', font: '/fonts', image: '/images', javascript: '/javascripts', stylesheet: '/stylesheets', video: '/videos' }


      def asset_path(source, options = {})
        source = source.to_s
        return "" unless source.present?
        return source if source =~ URI_REGEXP
        
        tail, source = source[/([\?#].+)$/], source.sub(/([\?#].+)$/, '')
        "#{source}#{tail}"
      end

      def stylesheet_path(source, options = {})
        asset_path(source, {type: :stylesheet}.merge!(options))
      end
      
      def javascript_path(source, options = {})
        asset_path(source, {type: :javascript}.merge!(options))
      end
      
      def image_path(source, options = {})
        asset_path(source, {type: :image}.merge!(options))
      end
      
      def stylesheet_link_tag(*sources)
        options = sources.extract_options!.stringify_keys
        path_options = options.extract!('protocol').symbolize_keys
        
        sources.uniq.map { |source|
          tag_options = {
            "rel" => "stylesheet",
            "media" => "screen",
            "href" => stylesheet_path(source, path_options)
          }.merge!(options)
          tag(:link, tag_options)
        }.join("\n").html_safe    
      end

      def javascript_include_tag(*sources)
        options = sources.extract_options!.stringify_keys
        path_options = options.extract!('protocol', 'extname').symbolize_keys
        sources.uniq.map { |source|
          tag_options = {
            "src" => javascript_path(source, path_options)
          }.merge!(options)
          content_tag(:script, "", tag_options)
        }.join("\n").html_safe
      end

      def image_tag(source, options)
        options = options.symbolize_keys
        
        src = options[:src] = image_path(source)
        
        unless src =~ /^(?:cid|data):/ || src.blank?
          options[:alt] = options.fetch(:alt){ image_alt(src) }
        end
        
        options[:width], options[:height] = extract_dimensions(options.delete(:size)) if options[:size]
        tag("img", options)
      end

    end
  end
end
