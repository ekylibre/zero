module ApplicationHelper

  def page(name, options = {}, &block)
    content_tag(:div, options.deep_merge(data: {role: "page"}, id: name), &block)
  end

  def page_header(*args, &block)
    options = args.extract_options!
    if block_given?
      options = options.deep_merge(id: args.first) if args.first.is_a?(Symbol)
      content_tag(:div, options.deep_merge(data: {role: "header"}), &block)
    else
      content_tag(:div, options.deep_merge(data: {role: "header"})) do
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

  def control_group(*args, &block)
    options = args.extract_options!
    options[:id] ||= args.shift
    type = options.delete(:type)
    content_tag(:div, options.deep_merge(data: {role: "controlgroup", type: type}), &block)
  end

  # Create a button
  def button(name, options = {}, &block)
    options = {data: {role: "button", transition: "slide-down"}, href: "#", id: name.to_s.gsub('_', '-')}.deep_merge(options)
    if block_given?
      content_tag(:a, options, &block)
    else
      content_tag(:a, options) do
        content_tag(:span, "", class: "fa fa-2x fa-#{options[:id]}")
      end
    end
  end

end
