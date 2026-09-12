package com.fmrent.cars.model;

import jakarta.persistence.*;

@Entity
@Table(name = "car_images")
public class CarImage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "image_url", nullable = false, length = 500) private String url;
    @Column(name = "image_file_id", nullable = false, length = 100) private String fileId;
    @Column(name = "display_order", nullable = false) private int displayOrder;
    protected CarImage() {}
    public CarImage(String url, String fileId, int displayOrder) { this.url=url; this.fileId=fileId; this.displayOrder=displayOrder; }
    public String getUrl(){ return url; }
    public String getFileId(){ return fileId; }
    public int getDisplayOrder(){ return displayOrder; }
    public void setDisplayOrder(int displayOrder){ this.displayOrder=displayOrder; }
}
