class Node
  attr_accessor :data, :back, :next

  def initialize (data, back_node = nil, next_node = nil)
    @data = data
    @next = next_node
    @back = back_node
  end

end

