class LinkedList
  attr_accessor :head

  def initialize(data)
    @head = Node.new(data)
  end

  def push(data)
    node = head
    loop do 
      break if node.next.next.nil? 
      node = node.next
    end
    node.next = Node.new(data)
  end

end