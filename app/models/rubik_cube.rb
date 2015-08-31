class RubikCube

  # ["front_left_up", "left_up_front", "up_front_left", 
  #  "front_up_right", "up_right_front", "right_front_up", 
  #  "front_down_left", "down_left_front", "left_front_down", 
  #  "front_right_down", "right_down_front", "down_front_right", 
  #  "back_up_left", "up_left_back", "left_back_up", 
  #  "back_right_up", "right_up_back", "up_back_right", 
  #  "back_left_down", "left_down_back", "down_back_left", 
  #  "back_down_right", "down_right_back", "right_back_down"]

  attr_accessor :cube

  DEFAULT_CUBE = ["rgw","gwr","wrg",
                  "rwb","wbr","brw",
                  "ryg","ygr","gry",
                  "rby","byr","yrb",
                  "owg","wgo","gow",
                  "obw","bwo","wob",
                  "ogy","gyo","yog",
                  "oyb","ybo","boy"]

  def initialize(cube_configuration = DEFAULT_CUBE)
    @cube = cube_configuration
  end

  def ==(other)
    self.cube == other.cube
  end

  def print
    0.upto(cube.size/3) do |cublet|
      puts "#{cube[3*cublet]} #{cube[3*cublet+1]} #{cube[3*cublet+2]}"
    end
  end

  def to_s
    self.cube.join('')
  end

  def turn(direction)
    self.send(direction)
    self
  end

  def move_set
    ["front_clockwise","front_counterclockwise","left_clockwise","left_counterclockwise","up_clockwise","up_counterclockwise"]
  end

  def apply_permutation(permutation)
    permutation.collect do |index| 
      @cube[index]
    end
  end

  def front_clockwise
    # [0,1,2,     3,4,5,      6,7,8,      9,10,11,    12,13,14,   15,16,17,   18,19,20,   21,22,23]
    # [6,7,8,     0,1,2,      9,10,11,    3,4,5,      12,13,14,   15,16,17,   18,19,20,   21,22,23]

    self.cube = apply_permutation([6,7,8,0,1,2,9,10,11,3,4,5,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  def front_counterclockwise
    # [0,1,2,     3,4,5,      6,7,8,    9,10,11,    12,13,14,   15,16,17,   18,19,20,   21,22,23]
    # [3,4,5,     9,10,11,    0,1,2,    6,7,8,      12,13,14,   15,16,17,   18,19,20,   21,22,23]

    self.cube = apply_permutation([3,4,5,9,10,11,0,1,2,6,7,8,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  def left_clockwise
    # [0,1,2,     3,4,5,    6,7,8,    9,10,11,    12,13,14,   15,16,17,   18,19,20,   21,22,23]
    # [13,14,12,  3,4,5,    2,0,1,    9,10,11,    20,18,19,   15,16,17,   7,8,6,      21,22,23]

    self.cube = apply_permutation([13,14,12,3,4,5,2,0,1,9,10,11,20,18,19,15,16,17,7,8,6,21,22,23])
  end

  def left_counterclockwise
    # [0,1,2,    3,4,5,   6,7,8,     9,10,11,   12,13,14,   15,16,17,    18,19,20,     21,22,23]
    # [7,8,6,    3,4,5,   20,18,19,  9,10,11,   2,0,1,      15,16,17,    13,14,12,     21,22,23]

    self.cube = apply_permutation([7,8,6,3,4,5,20,18,19,9,10,11,2,0,1,15,16,17,13,14,12,21,22,23])
  end

  def up_clockwise
    # [0,1,2,   3,4,5,      6,7,8,   9,10,11,  12,13,14,  15,16,17,   18,19,20,  21,22,23]
    # [5,3,4,   16,17,15,   6,7,8,   9,10,11,  1,2,0,     14,12,13,   18,19,20,  21,22,23]

    self.cube = apply_permutation([5,3,4,16,17,15,6,7,8,9,10,11,1,2,0,14,12,13,18,19,20,21,22,23])
  end

  def up_counterclockwise
    # [0,1,2,     3,4,5,      6,7,8,   9,10,11,  12,13,14,  15,16,17,   18,19,20,  21,22,23]
    # [14,12,13   1,2,0       6,7,8    9,10,11,  16,17,15   5,3,4       18,19,20,  21,22,23]

    self.cube = apply_permutation([14,12,13,1,2,0,6,7,8,9,10,11,16,17,15,5,3,4,18,19,20,21,22,23])
  end

end