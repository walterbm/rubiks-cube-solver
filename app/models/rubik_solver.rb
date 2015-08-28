class RubikSolver
  SOLVED_CUBE = RubikCube.new(["rgw","gwr","wrg","rwb","wbr","brw","ryg","ygr","gry","rby","byr","yrb","owg","wgo","gow","obw","bwo","wob","ogy","gyo","yog","oyb","ybo","boy"])

  # TEST_CUBE = ["gyo","yog","ogy","gow","owg","wgo","gry","ryg","ygr","rwb","wbr","brw","bwo","wob","obw","wrg","rgw","gwr","byr","yrb","rby","oyb","ybo","boy"]

  TEST_CUBE = ["ryg", "ygr", "gry", "rgw", "gwr", "wrg", "rby", "byr", "yrb", "rwb", "wbr", "brw", "owg", "wgo", "gow", "obw", "bwo", "wob", "ogy", "gyo", "yog", "oyb", "ybo", "boy"]
  
  def initialize(start_cube = TEST_CUBE)
    @start_cube = RubikCube.new(start_cube)
    @node_queue = []
    @past_moves = []
    @move_history = []
  end

  def neighbors(current)
    current.move_set.collect do |move|
      new_cube = RubikCube.new(current.cube).turn(move)
      valid_move?(new_cube) ? new_cube : nil
    end.compact
  end

  def valid_move?(new_cube)
    !@past_moves.include?(new_cube)
  end

  def add_to_queues(to, from = @start_cube)
    if !@past_moves.include?(to)
      @past_moves << to
      @node_queue << to
      @move_history << [to, from]
    end
  end

  def move
    current = @node_queue.shift
    neighbors(current).each do |neighbor|
      add_to_queues(neighbor,current)
    end
  end

  def solve
    add_to_queues(@start_cube)
    until solved?
      move
      puts "working"
    end
    puts "solved!"
    @move_history
  end

  def solved?
    @past_moves.include?(SOLVED_CUBE)
  end

end