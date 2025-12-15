
# Load System.Drawing assembly
Add-Type -AssemblyName System.Drawing

function Convert-ToJpeg ($filePath, $quality) {
    echo "Processing $filePath"
    $image = [System.Drawing.Image]::FromFile($filePath)
    
    # Encoder parameter for image quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
    
    # JPEG codec info
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    
    # New filename
    $newPath = $filePath -replace ".png", ".jpg"
    
    # Save
    $image.Save($newPath, $jpegCodec, $encoderParams)
    $image.Dispose()
    echo "Saved to $newPath"
}

# List of heavy images to convert (Photos only, preserving transparency for logos)
$imagesToConvert = @(
    "images/hero-1.png",
    "images/hero-2.png",
    "images/portfolio-1.png",
    "images/portfolio-2.png",
    "images/portfolio-3.png",
    "images/portfolio-4.png"
)

foreach ($file in $imagesToConvert) {
    if (Test-Path $file) {
        $absPath = Resolve-Path $file
        Convert-ToJpeg $absPath 85
    } else {
        echo "File not found: $file"
    }
}
