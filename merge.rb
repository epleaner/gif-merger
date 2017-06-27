require 'optparse'
require_relative 'merge_helper'

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: merge.rb [options]"

  opts.on('-b', '--background-image PATH', 'Background image') { |v| options[:background_image] = v }
  opts.on('-f', '--foreground-image PATH', 'Background image') { |v| options[:foreground_image] = v }
  opts.on('-c', '--replace-color COLOR', 'Color to replace') { |v| options[:replace_color] = v }
  opts.on('-s', '--shorten', 'Shorten longer animation') { || options[:shorten] = true }
  opts.on('-n', '--layer-name NAME', 'Layer name') { |v| options[:layer_name] = v }
  opts.on('-d', '--use-dominant-color', 'Replace dominant color') { || options[:use_dominant] = true }
  opts.on('-v', '--verbose', 'Verbose') { || options[:verbose] = true }

end.parse!


merge_helper = MergeHelper.new

if(options[:use_dominant])
  p "Calculating dominant color for #{options[:foreground_image]}" if options[:verbose]
  replace_color = merge_helper.dominant_color(options[:foreground_image])
else
  replace_color = options[:replace_color]
end

p "Making #{replace_color} transparent in #{options[:foreground_image]}" if options[:verbose]
transparent_foreground_path = merge_helper.make_transparent(options[:foreground_image], color: replace_color)

p "Merging #{options[:foreground_image]} and #{options[:background_image]}" if options[:verbose]
output_path = merge_helper.composite_merge(options[:background_image], transparent_foreground_path, options[:layer_name], shorten: options[:shorten])

`rm #{transparent_foreground_path}`

p "Done! Result in #{output_path}" if options[:verbose]