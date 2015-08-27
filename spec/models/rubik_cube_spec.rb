require "rails_helper"

RSpec.describe RubikCube, :type => :model do
  before do
    @test_cube_array = (0..23).to_a
    @test_cube = RubikCube.new(@test_cube_array)
  end

  it "returns the current cube array" do
    expect(@test_cube.print).to eq(@test_cube_array)
  end

  it "rotates the front face clockwise" do 
    expect(@test_cube.quarter_turn("front_clockwise")).to eq([6,7,8,0,1,2,9,10,11,3,4,5,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  it "rotates the front face counter-clockwise" do 
    expect(@test_cube.quarter_turn("front_counterclockwise")).to eq([3,4,5,9,10,11,0,1,2,6,7,8,12,13,14,15,16,17,18,19,20,21,22,23])
  end


  it "rotates the left face clockwise" do 
    expect(@test_cube.quarter_turn("left_clockwise")).to eq([13,14,12,3,4,5,2,0,1,9,10,11,20,18,19,15,16,17,7,8,6,21,22,23])
  end

  it "rotates the left face counter-clockwise" do 
    expect(@test_cube.quarter_turn("left_counterclockwise")).to eq([7,8,6,3,4,5,20,18,19,9,10,11,2,0,1,15,16,17,13,14,12,21,22,23])
  end

  it "rotates the up face clockwise" do 
    expect(@test_cube.quarter_turn("up_clockwise")).to eq([5,3,4,16,17,15,6,7,8,9,10,11,1,2,0,14,12,13,18,19,20,21,22,23])
  end

  it "rotates the up face counter clockwise" do 
    expect(@test_cube.quarter_turn("up_counterclockwise")).to eq([14,12,13,1,2,0,6,7,8,9,10,11,16,17,15,5,3,4,18,19,20,21,22,23])
  end

  it 'returns to original after one front clockwise turn and one front counter clockwise turn' do
    @test_cube.quarter_turn("front_clockwise")
    @test_cube.quarter_turn("front_counterclockwise")
    expect(@test_cube.cube).to eq([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  it 'returns to original after one left clockwise turn and one left counter clockwise turn' do
    @test_cube.quarter_turn("left_clockwise")
    @test_cube.quarter_turn("left_counterclockwise")
    expect(@test_cube.cube).to eq([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  it 'returns to original after one up clockwise turn and one up counter clockwise turn' do
    @test_cube.quarter_turn("up_clockwise")
    @test_cube.quarter_turn("up_counterclockwise")
    expect(@test_cube.cube).to eq([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  it 'returns to original after 4 front face clockwise turns' do
    @test_cube.quarter_turn("front_clockwise")
    @test_cube.quarter_turn("front_clockwise")
    @test_cube.quarter_turn("front_clockwise")
    @test_cube.quarter_turn("front_clockwise")
    expect(@test_cube.cube).to eq([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  it 'returns to original after 4 front face counter clockwise turns' do
    @test_cube.quarter_turn("front_counterclockwise")
    @test_cube.quarter_turn("front_counterclockwise")
    @test_cube.quarter_turn("front_counterclockwise")
    @test_cube.quarter_turn("front_counterclockwise")
    expect(@test_cube.cube).to eq([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  it 'returns to original after 4 left face clockwise turns' do
    @test_cube.quarter_turn("left_clockwise")
    @test_cube.quarter_turn("left_clockwise")
    @test_cube.quarter_turn("left_clockwise")
    @test_cube.quarter_turn("left_clockwise")
    expect(@test_cube.cube).to eq([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  it 'returns to original after 4 left face counter clockwise turns' do
    @test_cube.quarter_turn("left_counterclockwise")
    @test_cube.quarter_turn("left_counterclockwise")
    @test_cube.quarter_turn("left_counterclockwise")
    @test_cube.quarter_turn("left_counterclockwise")
    expect(@test_cube.cube).to eq([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  it 'returns to original after 4 up face clockwise turns' do
    @test_cube.quarter_turn("up_clockwise")
    @test_cube.quarter_turn("up_clockwise")
    @test_cube.quarter_turn("up_clockwise")
    @test_cube.quarter_turn("up_clockwise")
    expect(@test_cube.cube).to eq([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
  end

  it 'returns to original after 4 up face counter clockwise turns' do
    @test_cube.quarter_turn("up_counterclockwise")
    @test_cube.quarter_turn("up_counterclockwise")
    @test_cube.quarter_turn("up_counterclockwise")
    @test_cube.quarter_turn("up_counterclockwise")
    expect(@test_cube.cube).to eq([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
  end



end