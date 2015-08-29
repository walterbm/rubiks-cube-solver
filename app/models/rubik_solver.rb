class RubikSolver

  SOLVED_CUBE = RubikCube.new(["rgw","gwr","wrg","rwb","wbr","brw","ryg","ygr","gry","rby","byr","yrb","owg","wgo","gow","obw","bwo","wob","ogy","gyo","yog","oyb","ybo","boy"])

  def initialize(start_cube)
    @start_cube = RubikCube.new(start_cube)

    @forward_queue = []
    @backward_queue = []

    @past_forward_moves = []
    @past_backward_moves = []
  end

  def neighbors(current_node)
    current = current_node.data_cube
    current.move_set.collect do |move|
      new_cube = RubikCube.new(current.cube).turn(move)
      {move: move, cube: new_cube}
    end
  end

  def valid_forward_move?(cube)
    !@past_forward_moves.include?(cube)
  end

  def valid_backward_move?(cube)
    !@past_backward_moves.include?(cube)
  end

  def add_to_forwards_queues(move, to, from = nil)
    @past_forward_moves << to
    @forward_queue << Node.new({move: move, cube: to},from)
  end

  def add_to_backwards_queues(move, to, from = nil)
    @past_backward_moves << to
    @backward_queue << Node.new({move: move, cube: to},from)
  end

  def move_forward
    @forward_move = @forward_queue.shift
    neighbors(@forward_move).each do |neighbor|
      if valid_forward_move?(neighbor[:cube])
        add_to_forwards_queues(neighbor[:move], neighbor[:cube],@forward_move)
      end
    end
  end

  def move_backwards
    @backward_move = @backward_queue.shift
    neighbors(@backward_move).each do |neighbor|
      if valid_backward_move?(neighbor[:cube])
        add_to_backwards_queues(neighbor[:move], neighbor[:cube],@backward_move)
      end
    end
  end

  def solve
    add_to_forwards_queues("start", @start_cube)
    add_to_backwards_queues("solved", SOLVED_CUBE)
    until queues_empty?

      move_forward
      move_backwards
      binding.pry

      break if solved?

      puts "working"
    end
    binding.pry
    solution_manual
  end

  def solved?
    @past_forward_moves.any? do |move|
      @past_backward_moves.include?(move)
    end
  end

  def queues_empty?
    @forward_queue.nil? && @backward_queue.nil?
  end

  def solution_manual
    forward_chain = build_chain(@forward_move)
    backward_chain = build_chain(@backward_move)
    @solution_manual ||= forward_chain + backward_chain
  end

  def build_chain(current_node)
    node = current_node
    Array.new.tap do |solution_array|
      loop do 
        solution_array << node.data_move
        break if node.back.nil?
        node = node.back
      end
    end
  end

end