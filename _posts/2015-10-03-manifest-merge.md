---
layout: post
title: An example of Android's Manifest Merging
date: 2015-10-03
---

Android Studio (and the Android Gradle plugin) make our lives as Android developers much easier. A great feature of this tool suite is [Manifest Merging.][manifest-merging] Most of the time it isn't something you ever need to fiddle with. Libraries with permissions can include necessary permissions, debug builds can include a debug Activity, etc. This post is about one case where the Merger must be told how to correct itself.


### The Setup

Let's have a project with two flavors, `internal` and `production`, similar to the fantasic [U2020 sample][u2020]. An application using `Context.getExternalFilesDir()` pre KitKat (API 19) requires `android.permission.WRITE_EXTERNAL_STORAGE`, but can eliminate the app from need this permission with the `maxSdkVersion` attribute. 

**src/main/AndroidManifest.xml**

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="18"/>
```

Suppose inside the `internal` flavor we have functionality that requires the external storage permission. [LeakCanary][canary] (as of 1.4-SNAPSHOT) and bug reporting library [Telescope][telescope] (1.4.0 also) both use external storage for storing heap dumps and screenshots respectively. 

What do we add to `src/internal/AndroidManifest.xml` to require the permission for all SDK versions? If we add the permission without the `maxSdkVersion` attribute everything will continue to build, but we won't get the permission. The Android docs again come in handy in describing the merge order for attributes. There are *low* priority and *high* priority status for elements. So a set attribute, in our case the `maxSdkVersion` is given a high priority, and listing the same permission in the `internal` flavor manifest with no `maxSdkVersion` is given a low priority.

If we set the `maxSdkVersion` to the latest SDK available, say `android:maxSdkVersion="23"`, there will be two high priority elements and that results in a merge conflict. Studio will try giving a hint that you can use `tools:replace` and have the internal flavor replace the attribute. But this is a code smell! Everytime the SDK updates we'd have to make sure we change this number, the best option is to simply remove the attribute.

**src/internal/AndroidManifest.xml**

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        tools:remove="android:maxSdkVersion"/>
```



[manifest-merging]: https://developer.android.com/tools/building/manifest-merge.html
[u2020]: https://github.com/JakeWharton/u2020
[canary]: https://github.com/square/leakcanary
[telescope]: https://github.com/mattprecious/telescope