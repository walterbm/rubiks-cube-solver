class RubikSolver
  SOLVED_CUBE = RubikCube.new(["rgw","gwr","wrg","rwb","wbr","brw","ryg","ygr","gry","rby","byr","yrb","owg","wgo","gow","obw","bwo","wob","ogy","gyo","yog","oyb","ybo","boy"])
  
  attr_accessor :move_history, :past_moves

  def initialize(start_cube = TEST_CUBE)
    @start_cube = RubikCube.new(start_cube)

    @forward_node_queue = []
    @backward_node_queue = []

    @past_moves = []
  end

  def neighbors(current_node)
    current = current_node.data_cube
    current.move_set.collect do |move|
      new_cube = RubikCube.new(current.cube).turn(move)
      valid_move?(new_cube) ? {move: move, cube: new_cube} : nil
    end.compact
  end

  def valid_move?(cube)
    !@past_moves.include?(cube)
  end

  def add_to_queues(move, to, from = nil)
    @past_moves << to
    @forward_node_queue << Node.new({move: move, cube: to},from)
  end

  def move(queue)
    @current_move = queue.shift
    neighbors(@current_move).each do |neighbor|
      add_to_queues(neighbor[:move], neighbor[:cube],@current_move)
    end
  end

  def solve
    add_to_queues("start", @start_cube)
    loop do
      move(@forward_node_queue)
      break if solved?
      puts "working"
    end
    puts "solved!"
    solution_manual
  end

  def solved?
    @current_move.data_cube == SOLVED_CUBE
  end

  def solution_manual
    node = @current_move
    @solution_manual ||= Array.new.tap do |solution_array|
      loop do 
        solution_array << node.data_move
        break if node.back == nil
        node = node.back
      end
    end.reverse
  end

end