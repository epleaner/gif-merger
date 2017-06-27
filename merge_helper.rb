require 'pry'
class MergeHelper
  def get_frame_count(filepath)
    frame_count = `identify -format '%s\n' #{filepath} | tail -1`
    Integer(frame_count)
  end

  def shorten_longer(background_path, foreground_path)
    background_frame_count = get_frame_count(background_path)
    foreground_frame_count = get_frame_count(foreground_path)

    if background_frame_count > foreground_frame_count
      `convert #{background_path}[0-#{foreground_frame_count}] shortened_#{background_path}`
      background_path = "shortened_#{background_path}"

    elsif background_frame_count < foreground_frame_count
      `convert #{foreground_path}[0-#{background_frame_count}] shortened_#{foreground_path}`
      foreground_path = "shortened_#{foreground_path}"
    end

    [background_path, foreground_path]
  end

  def resize_to_match(background_path, foreground_path)
    background_width, background_height = `convert #{background_path} -ping -format "%wx%h|" info:`.split('|').first.split('x').map(&:to_i)
    foreground_width, foreground_height = `convert #{foreground_path} -ping -format "%wx%h|" info:`.split('|').first.split('x').map(&:to_i)

    if background_width * background_height > foreground_width * foreground_height
      `convert #{foreground_path} -coalesce -resize #{background_width}x#{background_height}! resized_#{foreground_path}`
      foreground_path = "resized_#{foreground_path}"
    elsif background_width * background_height < foreground_width * foreground_height
      `convert #{background_path} -coalesce -resize #{foreground_width}x#{foreground_height}! resized_#{background_path}`
      background_path = "resized_#{background_path}"
    end

    [background_path, foreground_path]
  end

  def composite_merge(background_path, foreground_path, layer_name, shorten: false)
    layer_name = 'merged' if layer_name.nil?
    output_path = "#{layer_name}.gif"

    if shorten
      background_path, foreground_path = shorten_longer(background_path, foreground_path)
    end

    background_path, foreground_path = resize_to_match(background_path, foreground_path)

    bg_frame_ranges = get_background_frame_ranges(background_path, foreground_path)

    `convert #{background_path}[#{bg_frame_ranges}] null: #{foreground_path} -gravity center -layers Composite #{output_path}`

    output_path
  end

  def make_transparent(image_path, fuzz: 10, color: "#000000")
    transparent_image_path = "transparent_#{image_path}"
    `convert #{image_path} -coalesce -fuzz "#{fuzz}%" -transparent "#{color}" miff:- | convert -dispose background - #{transparent_image_path}`

    transparent_image_path
  end

  def dominant_color(image_path)
    histogram_path = "#{image_path}.histogram"
    `convert #{image_path}  -format %c -depth 8  histogram:info:#{histogram_path}`

    dominant_color = `sort -n #{histogram_path} | tail -1`

    `rm #{histogram_path}`

    dominant_color.scan(/#[a-zA-Z0-9]*/).first
  end

  def get_background_frame_ranges(background_path, foreground_path)
    background_frames = get_frame_count(background_path)
    foreground_frames = get_frame_count(foreground_path)

    if foreground_frames <= background_frames
      frame_range = "0-#{foreground_frames - 1}"
    else
      bg_frame_length = "0-#{background_frames - 1}"
      bg_loops_within_fg = (foreground_frames / background_frames).floor
      frame_range = (0..bg_loops_within_fg - 1).to_a.fill(bg_frame_length).join(",")

      remainder = foreground_frames % background_frames
      if remainder > 0
        frame_range += "," if bg_loops_within_fg > 0
        frame_range += "0-#{remainder - 1}"
      end
    end

    frame_range
  end
end