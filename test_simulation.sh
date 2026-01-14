#!/bin/bash

# Simulate a Farmer sending "Namaskar" to the bot
echo "sending 'Namaskar' from generic farmer..."
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "12345",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "1234567890",
              "phone_number_id": "1234567890"
            },
            "contacts": [{
              "profile": { "name": "Ramesh Farmer" },
              "wa_id": "919876543210"
            }],
            "messages": [
              {
                "from": "919876543210",
                "id": "wamid.HBgM",
                "timestamp": "1705256789",
                "text": {
                  "body": "Namaskar"
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}'

echo -e "\n\nCheck your 'npm run dev' terminal window. You should see the AI's reply logged there!"
