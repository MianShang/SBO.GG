package com.example.backend.Dto;

import lombok.Data;

@Data
public class DnfEquipmentDto {

    private String itemName;
    private String itemType;
    private String itemRarity;
    private String slotName;
    private String itemId;

    @Override
    public String toString() {
        return "DnfEquipmentDto{" +
                "itemName='" + itemName + '\'' +
                ", itemType='" + itemType + '\'' +
                ", itemRarity='" + itemRarity + '\'' +
                ", slotName='" + slotName + '\'' +
                ", itemId='" + itemId + '\'' +
                '}';
    }

}
