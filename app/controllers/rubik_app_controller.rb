class RubikAppController < ApplicationController

  def index
  end

  def solve
    solution = RubikApp.new(cube_params_as_array)
    @moves = solution.solution_moves

    render json: @moves
  end

  private

    def cube_params_as_array
      params.require(:cube).split(',')
    end
  
end