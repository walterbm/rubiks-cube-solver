class RubikSolver

  # SOLVED = RubikCube.new(["rgw","gwr","wrg","rwb","wbr","brw","ryg","ygr","gry","rby","byr","yrb","owg","wgo","gow","obw","bwo","wob","ogy","gyo","yog","oyb","ybo","boy"])

  attr_reader :start_cube, :final_cube

  def initialize(start_cube_array)
    @start_cube = RubikCube.new(start_cube_array)
    @final_cube = set_solved_state

    @forward_queue = []
    @backward_queue = []

    @past_forward_moves = {}
    @past_backward_moves = {}
  end

  def set_solved_state
    opposite = {
      'r' => 'o',
      'o' => 'r',
      'w' => 'y',
      'y' => 'w',
      'b' => 'g',
      'g' => 'b'
    }

    cublet7 = @start_cube.cube.last

    right = cublet7[0]
    back = cublet7[1]
    down = cublet7[2]

    left = opposite[right]
    front = opposite[back]
    up = opposite[down]

    solved_state = [
      "#{front}#{left}#{up}", "#{left}#{up}#{front}", "#{up}#{front}#{left}", 
      "#{front}#{up}#{right}", "#{up}#{right}#{front}", "#{right}#{front}#{up}", 
      "#{front}#{down}#{left}", "#{down}#{left}#{front}", "#{left}#{front}#{down}", 
      "#{front}#{right}#{down}", "#{right}#{down}#{front}", "#{down}#{front}#{right}", 
      "#{back}#{up}#{left}", "#{up}#{left}#{back}", "#{left}#{back}#{up}", 
      "#{back}#{right}#{up}", "#{right}#{up}#{back}", "#{up}#{back}#{right}", 
      "#{back}#{left}#{down}", "#{left}#{down}#{back}", "#{down}#{back}#{left}", 
      "#{back}#{down}#{right}", "#{down}#{right}#{back}", "#{right}#{back}#{down}"
    ]

    RubikCube.new(solved_state)
  end

  def neighbors(current_node)
    current = current_node.data_cube
    current.move_set.collect do |move|
      new_cube = RubikCube.new(current.cube).turn(move)
      Node.new({move: move, cube: new_cube}, current_node)
    end
  end

  def valid_move?(move_history, node)
    !move_history.has_key?(node.data_cube.to_s)
  end

  def add_to_forward_queues(node)
    @past_forward_moves[node.data_cube.to_s] = node
    @forward_queue << node
  end

  def add_to_backward_queues(node)
    @past_backward_moves[node.data_cube.to_s] = node
    @backward_queue << node
  end

  def move_forward
    current_forward_move = @forward_queue.shift
    neighbors(current_forward_move).each do |neighbor|
      if valid_move?(@past_forward_moves,neighbor)
        add_to_forward_queues(neighbor)
      end
    end
  end

  def move_backwards
    current_backward_move = @backward_queue.shift
    neighbors(current_backward_move).each do |neighbor|
      if valid_move?(@past_backward_moves,neighbor)
        add_to_backward_queues(neighbor)
      end
    end
  end

  def solve
    add_to_forward_queues(Node.new({move: "start", cube: @start_cube}) )
    add_to_backward_queues(Node.new({move: "solved", cube: @final_cube}) )

    until queues_empty?

      break if solved?

      move_forward unless @forward_queue.empty?
      move_backwards unless @backward_queue.empty?
    end

    solution_manual
  end

  def solved?
    @past_forward_moves.any? { |move_key, move| @past_backward_moves.has_key?(move_key) }
  end

  def queues_empty?
    @forward_queue.empty? && @backward_queue.empty?
  end

  def find_queue_overlap
    @past_forward_moves.each do |move_key, move|
       @forward_move, @backward_move = move, @past_backward_moves[move_key] if @past_backward_moves.has_key?(move_key)
    end
  end

  def solution_manual
    find_queue_overlap
    forward_chain = build_chain(@forward_move).reverse
    backward_chain = inverse_moves(build_chain(@backward_move))
    @solution_manual ||= forward_chain + backward_chain
  end

  def inverse_moves(backward_chain)
    backward_chain.collect { |move| move.include?("counter") ? move.gsub("counter",'') : move.gsub("_","_counter") }
  end

  def build_chain(direction_node)
    node = direction_node
    Array.new.tap do |solution_array|
      loop do 
        solution_array << node.data_move
        break if node.back.nil?
        node = node.back
      end
    end
  end

end