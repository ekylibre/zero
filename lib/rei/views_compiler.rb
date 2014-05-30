require 'active_support/core_ext'

module Rei
  module ViewsCompiler

    # Writes index.html
    def self.write!
      # -r #{Rei.root}/app/helpers/helpers.rb
      # `haml #{Rei.root}/app/views/index.html.haml #{Rei.root}/www/index.html`
      unless file = Dir.glob(Rei.root.join("app", "views", "index.html.*")).delete_if{|f| f =~ /~$/}.first
        puts "Need views"
        exit 1
      end
      helpers_dir = Rei.root.join("app", "helpers")
      Dir.chdir helpers_dir do
        for helper in Dir["*.rb"]
          require helpers_dir.join(helper)
          Object.send(:include, helper[0..-4].camelize.constantize)
        end
      end
      template = Tilt.new(file)
      File.write(Rei.output.join('index.html'), template.render)
    end

  end
end
