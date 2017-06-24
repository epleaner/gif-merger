require 'optparse'
require_relative 'merge_helper'

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: merge.rb [options]"

  opts.on('-b', '--background-image PATH', 'Background image') { |v| options[:background_image] = v }
  opts.on('-c', '--replace-color COLOR', 'Color to replace') { |v| options[:replace_color] = v }
  opts.on('-f', '--foreground-image PATH', 'Background image') { |v| options[:foreground_image] = v }
  opts.on('-s', '--shorten', 'Shorten longer animation') { || options[:shorten] = true }
  opts.on('-n', '--layer-name NAME', 'Layer name') { |v| options[:layer_name] = v }


end.parse!


merge_helper = MergeHelper.new

transparent_foreground_path = merge_helper.make_transparent(options[:foreground_image], 25, options[:replace_color])

merge_helper.composite_merge(options[:background_image], transparent_foreground_path, options[:layer_name], options[:shorten])

`rm #{transparent_foreground_path}`
