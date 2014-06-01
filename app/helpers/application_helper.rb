module ApplicationHelper

  def page(name, options = {}, &block)
    content_tag(:div, options.deep_merge(data: {role: "page"}, id: name), &block)
  end

  def dialog(name, options = {}, &block)
    content_tag(:div, options.deep_merge(data: {role: "dialog"}, id: name), &block)
  end

  def page_header(*args, &block)
    options = args.extract_options!
    if block_given?
      options = options.deep_merge(id: args.first) if args.first.is_a?(Symbol)
      content_tag(:div, options.deep_merge(data: {role: "header", position: "fixed"}), &block)
    else
      content_tag(:div, options.deep_merge(data: {role: "header", position: "fixed"})) do
        content_tag(:h1, args.shift || "No title")
      end
    end
  end

  def page_content(options = {}, &block)
    if options.has_key?(:class)
      options[:class] += " ui-content"
    else
      options[:class] = "ui-content"
    end
    content_tag(:div, options.deep_merge(data: {role: "content"}), &block)
  end

  def page_footer(options = {}, &block)
    content_tag(:div, options.deep_merge(data: {role: "footer", position: "fixed"}), &block)
  end

  def control_group(*args, &block)
    options = args.extract_options!
    if id = args.shift
      options[:id] = id.to_s.gsub('_', '-')
    end
    type = options.delete(:type) || :horizontal # :vertical
    content_tag(:div, options.deep_merge(data: {role: "controlgroup", type: type}), &block)
  end

  def field(*args, &block)
    options = args.extract_options!
    name = args.shift
    content_tag(:div, options.deep_merge(class: "ui-field-contain", data: {role: "fieldcontain", field: name}), &block)
  end

  # Create a button
  def button(name, options = {}, &block)
    default = {data: {role: "button", transition: "slide-down"}, href: "#", id: name.to_s.gsub('_', '-')}
    if as = options.delete(:as)
      if as == :left_tool
        default[:class] = "ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left"
      elsif as == :right_tool
        default[:class] = "ui-btn-right ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right"
      end
    end
    options = default.deep_merge(options)
    if block_given?
      content_tag(:a, options, &block)
    else
      content_tag(:a, options) do
        content_tag(:span, "", class: "fa#{' fa-2x' unless as} fa-#{options[:icon] ? options.delete(:icon).to_s.gsub('_', '-') : options[:id]}")
      end
    end
  end

  def list(&block)
    content_tag(:ul, data: {role: "listview", inset: true}, &block)
  end

  def list_divider(content = nil, &block)
    if block_given?
      content_tag(:li, data: {role: "list-divider"}, &block)
    else
      content_tag(:li, content, data: {role: "list-divider"})
    end
  end

  def list_item(content = nil, &block)
    if block_given?
      content_tag(:li, &block)
    else
      content_tag(:li, content)
    end
  end

end
