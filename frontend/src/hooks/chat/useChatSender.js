
export function useChatSender(client, selectedRoom, userName, input, setInput) {
  
  function sendMessage() {
    if (client && input.trim()) {
      client.publish({
        destination: `/app/chat/${selectedRoom.id}`,
        body: JSON.stringify({ name: userName, message: input }),
      });
      setInput('');
    }
  }

  return sendMessage;
}