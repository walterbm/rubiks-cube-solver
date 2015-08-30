require "rails_helper"

RSpec.describe RubikCube, :type => :model do

  def test_solution(start, solution_moves)
    solution_moves.delete("start")
    solution_moves.delete("solved")
    solution_moves.each do |move|
      start.turn(move)
    end
    start == RubikCube.new
  end

  it "solves an already solved cube" do 
    start = RubikCube.new

    solver = RubikSolver.new(start.cube)
    solver.solve
    solution_moves = solver.solution_manual
    solution_moves.delete("start")
    solution_moves.delete("solved")
    
    expect(solution_moves.size).to eq(0)
    expect(test_solution(start,solution_moves)).to eq(true)
  end

  it "solves a cube 1 move removed" do
    start = RubikCube.new
    start.turn("front_clockwise")

    solver = RubikSolver.new(start.cube)
    solver.solve
    solution_moves = solver.solution_manual
    solution_moves.delete("start")
    solution_moves.delete("solved")
    
    expect(solution_moves.size).to eq(1)
    expect(test_solution(start,solution_moves)).to eq(true)
  end

  it "solves a cube 2 moves removed" do
    start = RubikCube.new
    start.turn("front_clockwise")
    start.turn("left_clockwise")

    solver = RubikSolver.new(start.cube)
    solver.solve
    solution_moves = solver.solution_manual
    solution_moves.delete("start")
    solution_moves.delete("solved")

    expect(solution_moves.size).to eq(2)
    expect(test_solution(start,solution_moves)).to eq(true)
  end

  it "solves a cube 3 moves removed" do
    start = RubikCube.new
    start.turn("front_clockwise")
    start.turn("front_clockwise")
    start.turn("left_counterclockwise")

    solver = RubikSolver.new(start.cube)
    solver.solve
    solution_moves = solver.solution_manual
    solution_moves.delete("start")
    solution_moves.delete("solved")
    
    expect(solution_moves.size).to eq(3)
    expect(test_solution(start,solution_moves)).to eq(true)
  end

  it "solves a cube 4 moves removed" do
    start = RubikCube.new
    start.turn("front_clockwise")
    start.turn("left_clockwise")
    start.turn("front_clockwise")
    start.turn("left_clockwise")

    solver = RubikSolver.new(start.cube)
    solver.solve
    solution_moves = solver.solution_manual
    solution_moves.delete("start")
    solution_moves.delete("solved")
    
    expect(solution_moves.size).to eq(4)
    expect(test_solution(start,solution_moves)).to eq(true)
  end


  it "solves a cube 8 moves removed" do
    start = RubikCube.new
    start.turn("front_clockwise")
    start.turn("left_clockwise")
    start.turn("front_clockwise")
    start.turn("left_clockwise")
    start.turn("front_clockwise")
    start.turn("left_clockwise")
    start.turn("front_clockwise")
    start.turn("left_clockwise")

    solver = RubikSolver.new(start.cube)
    solver.solve
    solution_moves = solver.solution_manual
    solution_moves.delete("start")
    solution_moves.delete("solved")
    
    expect(solution_moves.size).to eq(8)
    expect(test_solution(start,solution_moves)).to eq(true)
  end

  it "solves a cube 10 moves removed" do
    start = RubikCube.new
    start.turn("front_clockwise")
    start.turn("left_clockwise")
    start.turn("front_clockwise")
    start.turn("left_clockwise")
    start.turn("front_clockwise")
    start.turn("left_clockwise")
    start.turn("front_clockwise")
    start.turn("left_clockwise")
    start.turn("front_clockwise")
    start.turn("left_clockwise")

    solver = RubikSolver.new(start.cube)
    solver.solve
    solution_moves = solver.solution_manual
    solution_moves.delete("start")
    solution_moves.delete("solved")
    
    expect(solution_moves.size).to eq(10)
    expect(test_solution(start,solution_moves)).to eq(true)
  end

  xit "solves a cube 14 moves removed" do
    start = RubikCube.new([6,7,8,20,18,19,3,4,5,16,17,15,0,1,2,14,12,13,10,11,9,21,22,23])

    solver = RubikSolver.new(start.cube)
    solver.solve
    solution_moves = solver.solution_manual
    solution_moves.delete("start")
    solution_moves.delete("solved")
    
    expect(solution_moves.size).to eq(14)
    expect(test_solution(start,solution_moves)).to eq(true)
  end

  xit "does not solve an impossible cube" do
    impossible_cube = RubikCube.new([7,8,6,20,18,19,3,4,5,16,17,15,0,1,2,14,12,13,10,11,9,21,22,23])
  end

end