class RubikAppController < ApplicationController

  def index
  end

  def solve
    solution = RubikApp.new(cube_params_as_array).solution_moves

    binding.pry
    
    render plain: "hello from the controller"
  end

  private

    def cube_params_as_array
      params.require(:cube).split(',')
    end
  
end
