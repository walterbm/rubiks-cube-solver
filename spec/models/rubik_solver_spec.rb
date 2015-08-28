require "rails_helper"

RSpec.describe RubikCube, :type => :model do

  it "solves an already solved cube" do 
    start = RubikCube.new

    solution_moves = RubikSolver.new(start.cube).solve

    expect(solution_moves.past_moves.last).to eq(RubikCube.new)
    # expect(solution_moves.move_history.size).to eq(0)
  end

  it "solves a cube 1 move removed" do
    start = RubikCube.new
    start.turn("front_clockwise")

    solution_moves = RubikSolver.new(start.cube).solve
    binding.pry
    expect(solution_moves.past_moves.last).to eq(RubikCube.new)
    # expect(solution_moves.move_history.size).to eq(1)
  end

  it "solves a cube 2 moves removed" do
    start = RubikCube.new
    start.turn("front_clockwise")
    start.turn("left_clockwise")

    solution_moves = RubikSolver.new(start.cube).solve

    expect(solution_moves.past_moves.last).to eq(RubikCube.new)
    # expect(solution_moves.move_history.size).to eq(2)
  end

  it "solves a cube 3 moves removed" do
    start = RubikCube.new
    start.turn("front_clockwise")
    start.turn("front_clockwise")
    start.turn("left_counterclockwise")

    solution_moves = RubikSolver.new(start.cube).solve
    
    expect(solution_moves.past_moves.last).to eq(RubikCube.new)
    # expect(solution_moves.move_history.size).to eq(3)
  end

  it "solves a cube 4 moves removed" do
    start = RubikCube.new
    start.turn("front_clockwise")
    start.turn("left_clockwise")
    start.turn("front_clockwise")
    start.turn("left_clockwise")

    solution_moves = RubikSolver.new(start.cube).solve
    
    expect(solution_moves.past_moves.last).to eq(RubikCube.new)
    # expect(solution_moves.move_history.size).to eq(4)
  end

  # it "solves a cube 14 moves removed" do
  #   start = RubikCube.new([6,7,8,20,18,19,3,4,5,16,17,15,0,1,2,14,12,13,10,11,9,21,22,23])

  #   solution_moves = RubikSolver.new(start.cube).solve
    
  #   expect(solution_moves.past_moves.last).to eq(RubikCube.new)
  #   expect(solution_moves.move_history.size).to eq(14)
  # end

  # it "does not solve an inpossible cube" do
  #   impossible_cube = RubikCube.new([7,8,6,20,18,19,3,4,5,16,17,15,0,1,2,14,12,13,10,11,9,21,22,23])
  # end

end