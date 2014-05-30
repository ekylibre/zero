require 'logger'
require 'pathname'

module Rei

  autoload :AssetsCompiler, 'rei/assets_compiler'
  autoload :ViewsCompiler,  'rei/views_compiler'
  autoload :Helpers,        'rei/helpers'

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
