module Rei
  module Helpers
    extend ActiveSupport::Autoload
    
    autoload :AssetTagHelper
    autoload :RenderingHelper
    autoload :TagHelper

    # include AssetTagHelper
    # include TagHelper
  end
end
