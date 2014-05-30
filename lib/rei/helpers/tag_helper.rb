module Rei
  module Helpers
    module TagHelper

      def content_tag(tag, content = nil, options = {}, &block)
        "<#{tag}" + tag_attributes(options) + ">" + (block_given? ? 'CAPTURE' : '') + "</#{tag}>"
      end

      def tag(tag, options={})
        "<#{tag}" + tag_attributes(options) + "/>"
      end

      def tag_attributes(options)
        return options.collect do |key, value|
          ' ' + key.to_s + '="' + ERB::Util.html_escape(value.to_s) + '"'
        end.join
      end

    end
  end
end
