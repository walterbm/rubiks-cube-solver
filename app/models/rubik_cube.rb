class RubikCube

  DEFAULT_CUBE = ["front_left_up", "left_up_front", "up_front_left", 
                  "front_up_right", "up_right_front", "right_front_up", 
                  "front_down_left", "down_left_front", "left_front_down", 
                  "front_right_down", "right_down_front", "down_front_right", 
                  "back_up_left", "up_left_back", "left_back_up", 
                  "back_right_up", "right_up_back", "up_back_right", 
                  "back_left_down", "left_down_back", "down_back_left", 
                  "back_down_right", "down_right_back", "right_back_down"]

  attr_accessor :cube

  def initialize(cube_configuration = DEFAULT_CUBE)
    @cube = cube_configuration
  end

  def print
    "hello"
  end

  def quarter_turn(direction)
    self.send(direction)
  end

  def front_clockwise
    # [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
    # [6,7,8,0,1,2,9,10,11,3,4,5,12,13,14,15,16,17,18,19,20,21,22,23]
    @cube[0...3], @cube[3...6], @cube[6...9], @cube[9...12] = @cube[6...9], @cube[0...3], @cube[9...12], @cube[3...6]
    @cube
  end

  def front_counterclockwise

  end

  def left_clockwise

  end

  def left_counterclockwise

  end

  def up_clockwise

  end

  def up_counterclockwise

  end


end