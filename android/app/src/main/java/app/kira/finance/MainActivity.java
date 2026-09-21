package app.kira.finance;

import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;
import androidx.core.splashscreen.SplashScreen;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (bridge == null || bridge.getWebView() == null) {
                    moveTaskToBack(true);
                    return;
                }
                bridge.getWebView().evaluateJavascript(
                    "typeof window.kiraHandleNativeBack === 'function' && window.kiraHandleNativeBack()",
                    handled -> { if (!"true".equals(handled)) moveTaskToBack(true); }
                );
            }
        });
    }
}
