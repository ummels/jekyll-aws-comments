Jekyll::Hooks.register :site, :after_reset do |site|
  # Add comments collections
  config = site.config
  collections = site.config['collections']

  case collections
  when Hash
    collections['comments'] ||= {}
  when Array
    collections.push('comments') unless collections.include?('comments')
  when nil
    config['collections'] = {'comments' => {}}
  else
    raise ArgumentError, "Your `collections` key must be a hash or an array."
  end
end

Jekyll::Hooks.register :site, :pre_render do |site, payload|
  # Initalize module with comments
  comments = site.collections['comments'].docs
  Comments.load(comments)
  # Render all comments before posts are rendered
  comments.each do |document|
    if site.regenerator.regenerate?(document)
      document.output = Jekyll::Renderer.new(site, document, payload).run
      document.trigger_hooks(:post_render)
    end
  end
end

Jekyll::Hooks.register :posts, :pre_render do |post, payload|
  # Lookup comments for this post
  comments = Comments.get(post.id)
  # Enrich post with comment attributes
  payload['page']['comments'] = comments if comments.length > 0
  payload['page']['comment_count'] = comments.length
end

module Comments
  def self.load(comments)
    @comments = Hash.new() { |h, k| h[k] = Array.new }

    for comment in comments
      @comments[comment['post_id']] << comment
    end
  end

  def self.get(post_id)
    @comments[post_id]
  end
end
