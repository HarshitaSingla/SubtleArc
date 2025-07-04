package com.bezier.bezier_backend.model;

public class EllipseInput {
    private double semiMajor;
    private double semiMinor;
    private double centerX;
    private double centerY;

    public EllipseInput() {
    }

    public EllipseInput(double semiMajor, double semiMinor, double centerX, double centerY) {
        this.semiMajor = semiMajor;
        this.semiMinor = semiMinor;
        this.centerX = centerX;
        this.centerY = centerY;
    }

    public double getSemiMajor() {
        return semiMajor;
    }

    public void setSemiMajor(double semiMajor) {
        this.semiMajor = semiMajor;
    }

    public double getSemiMinor() {
        return semiMinor;
    }

    public void setSemiMinor(double semiMinor) {
        this.semiMinor = semiMinor;
    }

    public double getCenterX() {
        return centerX;
    }

    public void setCenterX(double centerX) {
        this.centerX = centerX;
    }

    public double getCenterY() {
        return centerY;
    }

    public void setCenterY(double centerY) {
        this.centerY = centerY;
    }
}
