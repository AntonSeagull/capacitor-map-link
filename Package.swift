// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorMapLink",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "CapacitorMapLink",
            targets: ["CapMapLinkPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "CapMapLinkPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/CapMapLinkPlugin"),
        .testTarget(
            name: "CapMapLinkPluginTests",
            dependencies: ["CapMapLinkPlugin"],
            path: "ios/Tests/CapMapLinkPluginTests")
    ]
)