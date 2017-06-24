class MergeHelper
  def get_length(filepath)
    length = `identify -format '%s\n' #{filepath} | tail -1`
    Integer(length)
  end

  def shorten_longer(background_path, foreground_path)
    background_length = get_length(background_path)
    foreground_length = get_length(foreground_path)

    if background_length > foreground_length
      `convert #{background_path}[0-#{foreground_length}] shortened_#{background_path}`

      background_path = "shortened_#{background_path}"
    elsif background_length < foreground_length
      `convert #{foreground_path}[0-#{background_length}] shortened_#{foreground_path}`

      foreground_path = "shortened_#{foreground_path}"
    end

    [background_path, foreground_path]
  end

  def composite_merge(background_path, foreground_path, layer_name, shorten=false)
    if shorten
      background_path, foreground_path = shorten_longer(background_path, foreground_path)
    end

    `convert #{background_path} null: #{foreground_path} -gravity center -layers Composite #{layer_name}.gif`
  end

  def make_transparent(image_path, fuzz=25, color="#000000")
    transparent_image_path = "transparent_#{image_path}"
    `convert #{image_path} -coalesce -fuzz "#{fuzz}%" -transparent "#{color}" miff:- | convert -dispose background - #{transparent_image_path}`

    transparent_image_path
  end
end