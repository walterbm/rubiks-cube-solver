require "rails_helper"

RSpec.describe RubikCube, :type => :model do
  before do
    @test_cube_config = (0..23).to_a
    @test_cube = RubikCube.new(@test_cube_config)
  end

  it "prints out cube array" do
    expect(@test_cube.print).to eq("hello")
  end

  it "rotates the front face clockwise" do 
    expect(@test_cube.quarter_turn("front_clockwise")).to eq([6,7,8,0,1,2,9,10,11,3,4,5,12,13,14,15,16,17,18,19,20,21,22,23])
  end

end