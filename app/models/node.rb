class Node
  attr_reader :data, :data_cube, :data_move
  attr_accessor :back


  def initialize (data, back_node = nil)
    @data = data
    @back = back_node

    @data_cube = data.has_key?(:cube) ? @data[:cube] : nil
    @data_move = data.has_key?(:move) ? @data[:move] : nil
  end

  def == (node)
    self.data_cube == node.data_cube
  end

end

