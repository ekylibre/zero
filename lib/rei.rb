require 'logger'
require 'pathname'
require 'rubygems'
require 'active_support'
# require 'bundler/setup'

module Rei

  autoload :AssetsCompiler, 'rei/assets_compiler'
  autoload :ViewsCompiler,  'rei/views_compiler'
  autoload :AssetUrlHelper, 'rei/asset_url_helper'

  class << self
    
    def root
      @root ||= Pathname(__FILE__).dirname.dirname
    end

    def output
      @output ||= root.join("www")
    end

    def logger
      @logger ||= Logger.new(File.open(root.join("log", "compile.log"), "ab"))
    end

  end

end
