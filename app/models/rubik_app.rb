class RubikApp

  attr_reader :solution_moves

  def initialize(cube_params_as_array)
    solver = RubikSolver.new(cube_params_as_array)
    solver.solve

    @solution_moves = solver.solution_manual
    @solution_moves.delete("start")
    @solution_moves.delete("solved")
  end

end