# OptiView Application

OptiView is an application that allows users to virtually try on glasses.

## Core Features:

-   **Virtual Try-On**: Allow users to upload a photo and virtually try on different frames to see how they look.
-   **Frame Recommendation**: Use a generative AI tool to suggest frames based on face shape, style preferences, and past purchases.
-   **Prescription Input**: Enable users to securely input their prescription details manually.
-   **Product Catalog**: Display available frames with detailed information (brand, size, material, price) and high-quality images.
-   **Favorites List**: Allow users to save their favorite frames to a list for easy access.

# Firebase Extension Documentation

This section provides information on how to create documentation for a Firebase extension.

## README File

To auto-generate a `README.md` file from your `extension.yaml` and `PREINSTALL.md` files, you can use the following Firebase CLI command:

```
firebase ext:info ./path/to/extension --markdown > README.md
```

## User Documentation

Every extension must have the following documentation files:

*   `PREINSTALL.md`
*   `POSTINSTALL.md`
*   `CHANGELOG.md`

You can also create longer-form tutorials and guides on your own website and link to them in your `PREINSTALL.md`. For best practices, it is recommended to review the documentation for the [official Firebase extensions](//github.com/firebase/extensions).