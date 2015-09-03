class RubikAppController < ApplicationController

  def index
  end

  def solve
    cube = RubikCube.new(cube_params_as_array)
    binding.pry
    render plain: "hello from the controller"
  end

  private
    def cube_params_as_array
      params.require(:cube).split(',')
    end
  
end
