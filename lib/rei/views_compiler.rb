require 'active_support/core_ext'
require 'action_view'
require 'action_controller' # waiting for new rails version to remove it
require "haml/util"
require "haml/template"

module Rei
  module ViewsCompiler

    VIEW_PATH_REGEXP = /\A(\w+\/)*([a-z]\w+\.html)(\.\w+)+\z/

    # Writes index.html
    def self.write!
      # Needed for assets path
      ActionView::Base.send :include, Rei::AssetUrlHelper

      # Custom helpers
      helpers_dir = Rei.root.join("app", "helpers")
      Dir.chdir helpers_dir do
        for helper in Dir["*.rb"]
          require helpers_dir.join(helper)
          ActionView::Base.send :include, helper[0..-4].camelize.constantize
        end
      end

      # Rendering
      views_dir = Rei.root.join("app", "views")
      view = ActionView::Base.new(views_dir)
      Dir.chdir(views_dir) do
        for file in Dir["**/*.html.*"]
          next unless file =~ VIEW_PATH_REGEXP
          file.gsub!(VIEW_PATH_REGEXP, '\1\2')
          output = Rei.output.join(file)
          FileUtils.mkdir_p(output.dirname)
          File.write(output, view.render(template: file))
        end
      end
    end

  end
end
