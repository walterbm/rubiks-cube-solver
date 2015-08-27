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
    cube
  end

  def quarter_turn(direction)
    self.send(direction)
  end

  def front_clockwise
    cube[0...3], cube[3...6], cube[6...9], cube[9...12] = cube[6...9], cube[0...3], cube[9...12], cube[3...6]
    cube
  end

  def front_counterclockwise
    cube[0...3], cube[3...6], cube[6...9], cube[9...12] = cube[3...6], cube[9...12], cube[0...3], cube[6...9]
    cube
  end

  def left_clockwise
    # [0,1,2,     3,4,5,    6,7,8,    9,10,11,    12,13,14,   15,16,17,   18,19,20,   21,22,23]
    # [13,14,12,  3,4,5,    2,0,1,    9,10,11,    20,18,19,   15,16,17,   7,8,6,      21,22,23]

    cube[0], cube[1], cube[2], 
    cube[6], cube[7], cube[8], 
    cube[12], cube[13], cube[14],
    cube[18], cube[19], cube[20] =  cube[13], cube[14], cube[12], 
                                    cube[2], cube[0], cube[1],
                                    cube[20], cube[18], cube[19],
                                    cube[7], cube[8], cube[6]
    cube
  end

  def left_counterclockwise
    # [0,1,2,    3,4,5,   6,7,8,     9,10,11,   12,13,14,   15,16,17,    18,19,20,     21,22,23]
    # [7,8,6,    3,4,5,   20,18,19,  9,10,11,   2,0,1,      15,16,17,    13,14,12,     21,22,23]

    cube[0], cube[1], cube[2], 
    cube[6], cube[7], cube[8], 
    cube[12], cube[13], cube[14],
    cube[18], cube[19], cube[20] =  cube[7], cube[8], cube[6],
                                    cube[20], cube[18], cube[19], 
                                    cube[2], cube[0], cube[1],
                                    cube[13], cube[14], cube[12]
                                    
    cube
  end

  def up_clockwise
    # [0,1,2,   3,4,5,      6,7,8,   9,10,11,  12,13,14,  15,16,17,   18,19,20,  21,22,23]
    # [5,3,4,   16,17,15,   6,7,8,   9,10,11,  1,2,0,     14,12,13,   18,19,20,  21,22,23]

    cube[0], cube[1], cube[2], 
    cube[3], cube[4], cube[5], 
    cube[12], cube[13], cube[14],
    cube[15], cube[16], cube[17] =  cube[5], cube[3], cube[4],
                                    cube[16], cube[17], cube[15], 
                                    cube[1], cube[2], cube[0],
                                    cube[14], cube[12], cube[13]
                                    
    cube
  end

  def up_counterclockwise
    # [0,1,2,     3,4,5,      6,7,8,   9,10,11,  12,13,14,  15,16,17,   18,19,20,  21,22,23]
    # [14,12,13   1,2,0       6,7,8    9,10,11,  16,17,15   5,3,4       18,19,20,  21,22,23]

    cube[0], cube[1], cube[2], 
    cube[3], cube[4], cube[5], 
    cube[12], cube[13], cube[14],
    cube[15], cube[16], cube[17] =  cube[14], cube[12], cube[13],
                                    cube[1], cube[2], cube[0], 
                                    cube[16], cube[17], cube[15],
                                    cube[5], cube[3], cube[4]
                                    
    cube
  end

end