require 'active_support/core_ext'
require 'action_view'
require 'action_controller' # waiting for new rails version to remove it
require "haml/util"
require "haml/template"

module Rei
  module ViewsCompiler

    # Writes index.html
    def self.write!
      # Needed for assets path
      ActionView::Base.send :include, Rei::Helper

      # Custom helpers
      helpers_dir = Rei.root.join("app", "helpers")
      Dir.chdir helpers_dir do
        for helper in Dir["*.rb"]
          require helpers_dir.join(helper)
          ActionView::Base.send :include, helper[0..-4].camelize.constantize
        end
      end

      # Rendering
      view = ActionView::Base.new(Rei.root.join("app", "views"))
      File.write(Rei.output.join('index.html'), view.render(template: "index.html"))
    end

  end
end
